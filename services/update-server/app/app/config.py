import os

from _orchest.internals import config as _config


class Config:
    DEBUG = False
    CLOUD = _config.CLOUD
    FLASK_ENV = os.environ.get("FLASK_ENV", "production")
    # The port nginx will listen on. Necessary for a proper restart.
    PORT = os.environ["PORT"]


class DevelopmentConfig(Config):
    DEBUG = True


# ---- CONFIGURATIONS ----
# Production
CONFIG_CLASS = Config

# Development
if os.environ.get("FLASK_ENV") == "development":
    CONFIG_CLASS = DevelopmentConfig
