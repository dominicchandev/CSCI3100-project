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

    def delete(self, db: Session, id: int):
        data_item = self.read(db=db, id=id)
        db.delete(data_item)
        db.commit()
        return data_item
    