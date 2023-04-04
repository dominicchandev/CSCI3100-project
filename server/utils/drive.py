from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

from server.utils.setting import Setting

setting = Setting()
gauth = GoogleAuth()
drive = GoogleDrive(gauth)

def upload_pdf_and_get_link(file_path: str) -> str:
    file_type = file_path.split('.')[-1]
    file_name = file_path.split('/')[-1]
    if file_type != 'pdf':
        raise TypeError("Not a pdf file")
    folder_id = setting.DRIVE_FOLDER_ID
    gfile = drive.CreateFile({
        'parents': [{'id': folder_id}],
        'title': file_name,
    })
    gfile.SetContentFile(file_path)
    gfile.Upload()
    link = gfile['alternateLink']
    return link
