from abc import ABC, abstractmethod
from sqlalchemy.orm import Session

class CRUDBase(ABC):
    def __init__(self, model):
        self.model = model

    @abstractmethod
    def create(self):
        pass

    def read(self, db: Session, id: int):
        data_item = db.query(self.model).get(id)
        if not data_item:
            return None
        return data_item

    @abstractmethod
    def update(self):
        pass

    def delete(self, db: Session, id: int):
        return db.query(self.model).get(id).delete()
    