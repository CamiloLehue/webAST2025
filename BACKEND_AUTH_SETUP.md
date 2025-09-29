# Endpoints de Autenticación para FastAPI

Agrega estos endpoints a tu backend de FastAPI:

## 1. Router de Autenticación (auth.py)

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from bson import ObjectId
import os
from typing import Optional

from database import get_db_mongo
from schemas.Usuario import UsuarioSchema

# Configuración
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")  # Cambia esto en producción
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str):
    user = await db.usuarios.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncIOMotorDatabase = Depends(get_db_mongo)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.usuarios.find_one({"email": email})
    if user is None:
        raise credentials_exception
    
    # Verificar que el usuario esté activo
    if not user.get("active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo"
        )
    
    user["id"] = str(user["_id"])
    return user

@router.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncIOMotorDatabase = Depends(get_db_mongo)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar que el usuario esté activo
    if not user.get("active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    # Actualizar último login
    await db.usuarios.update_one(
        {"_id": user["_id"]},
        {"$set": {"updated_at": datetime.utcnow()}}
    )
    
    user["id"] = str(user["_id"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "active": user["active"],
            "created_at": user["created_at"],
            "updated_at": user["updated_at"]
        }
    }

@router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "active": current_user["active"],
        "created_at": current_user["created_at"],
        "updated_at": current_user["updated_at"]
    }
```

## 2. Instalar dependencias adicionales

```bash
pip install python-jose[cryptography] python-multipart
```

## 3. Agregar a main.py

```python
from auth import router as auth_router

app.include_router(auth_router, prefix="/api")
```

## 4. Variable de entorno

Agrega esto a tu archivo .env:

```
SECRET_KEY=tu_clave_secreta_muy_segura_aqui_cambiar_en_produccion
```

## 5. Actualizar dependencias en requirements.txt

```txt
python-jose[cryptography]
python-multipart
```

Con estos endpoints, tu frontend podrá:
- Hacer login con email/password
- Obtener tokens JWT
- Verificar el usuario actual
- Manejar usuarios inactivos
- Actualizar último login

El token se envía automáticamente en las headers de las requests del frontend.