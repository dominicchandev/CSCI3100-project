import dropbox
import requests
from dropbox.exceptions import AuthError

from server.utils.setting import Setting

setting = Setting()

refresh_token = setting.DROPBOX_REFERSH_TOKEN
client_id = setting.DROPBOX_CLIENT_ID
client_secret = setting.DROPBOX_CLIENT_SECRET

class DropBoxHandler:
    def __init__(self) -> None:
        self.dbx = None
        self.dropbox_dir = "/CSCI3100-project/"
        self.access_token = None

    def connect(self) -> None:
        if not self.access_token:
            self.access_token = self._generate_access_token()
        try:
            self.dbx = dropbox.Dropbox(self.access_token)
        except AuthError as e:
            self.access_token = self._generate_access_token()
            self.dbx = dropbox.Dropbox(self.access_token)
        return
    
    def _generate_access_token(self) -> str:
        response = requests.post(
                "https://api.dropbox.com/oauth2/token",
                {
                    "grant_type": "refresh_token",
                    "refresh_token": refresh_token,
                    "client_id": client_id,
                    "client_secret": client_secret
                }
            )
        access_token = response.json()["access_token"]
        return access_token

    
    def upload_pdf(self, file_path: str):
        files = self._list_files()
        file_type = file_path.split('.')[-1]
        file_name = file_path.split('/')[-1]
        if file_type != 'pdf':
            raise TypeError("Not a pdf file")
        if file_name in files:
            return
        dropbox_file_path = self.dropbox_dir + file_name
        with open(file_path, "rb") as f:
            meta = self.dbx.files_upload(f.read(), dropbox_file_path, mode=dropbox.files.WriteMode("overwrite"))
        return meta
    
    def get_link(self, file_name: str):
        dropbox_file_path = self.dropbox_dir + file_name
        shared_link_metadata = self.dbx.sharing_create_shared_link(dropbox_file_path)            
        shared_link = shared_link_metadata.url
        shared_link = shared_link.replace('?d1=0', '?d1=1')
        return shared_link
    
    def _list_files(self) -> list:
        files = self.dbx.files_list_folder(self.dropbox_dir).entries
        files_list = [file.name for file in files]
        return files_list
