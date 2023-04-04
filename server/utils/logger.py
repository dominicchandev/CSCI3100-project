import os
import logging

def get_logger(name: str):
    LOG_LIST = [0, 10, 20, 30, 40, 50]
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )
    logger = logging.getLogger(name=name)
    custom_level = os.environ.get("LOG_LEVEL")
    if custom_level:
        logger.setLevel(custom_level)
    return logger