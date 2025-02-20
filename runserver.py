# import os
# import sys

# if __name__ == "__main__":
#     os.environ.setdefault("DJANGO_SETTINGS_MODULE", "company_management.settings")
#     os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'company_management/productadd.settings')
#     try:
#         from django.core.management import execute_from_command_line
#     except ImportError as exc:
#         raise ImportError(
#             "Couldn't import Django. Are you sure it's installed and "
#             "available on your PYTHONPATH environment variable? Did you "
#             "forget to activate a virtual environment?"
#         ) from exc
#     # Check if the first argument is 'runserver'
#     if len(sys.argv) < 2 or sys.argv[1] != 'runserver':
#         sys.argv.insert(1, 'runserver')  # Default to 'runserver' if not provided
#     execute_from_command_line(sys.argv)

# import os
# import sys

# # Set the main settings module (Update this if needed)
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "company_management.settings")  

# import django
# from django.core.management import execute_from_command_line

# django.setup()

# if __name__ == "__main__":
#     execute_from_command_line(["manage.py", "runserver", "0.0.0.0:8000"])

import os
import sys
import django
from django.core.management import execute_from_command_line

# Set the default settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "company_management.settings")

django.setup()

if __name__ == "__main__":
    # Disable Django's autoreloader
    execute_from_command_line(["manage.py", "runserver", "0.0.0.0:8000", "--noreload"])
