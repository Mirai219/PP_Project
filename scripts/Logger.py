import logging
import os

class Logger:
    def __init__(self,log_file):
        logging.basicConfig(filename=log_file, level=logging.INFO,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S')
        if not os.path.exists(log_file):
            with open(log_file, 'w') as f:
                pass
        self.logger = logging.getLogger(__name__)

    def log(self, message):
        self.logger.info(message)

    def error(self, message):
        self.logger.error(message)

    def warning(self, message):
        self.logger.warning(message)

    def debug(self, message):
        self.logger.debug(message)