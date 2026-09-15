import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "The Lenny Growth Assistant"
    API_V1_STR: str = "/api"
    
    # Persistence
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./lenny_growth_assistant.db")
    
    # LLM Settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3")
    
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "sk-ant-api03-lenny-growth-assistant-demo-key")
    ANTHROPIC_MODEL: str = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
    
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "sk-proj-lenny-growth-assistant-demo-key")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o")
    
    DEFAULT_PROVIDER: str = os.getenv("DEFAULT_PROVIDER", "ollama")
    FORCE_PROVIDERS_ONLINE: bool = True
    
    # Security
    ALLOWED_ORIGINS: list[str] = ["*"]
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
