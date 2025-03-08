from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import math
from faker import Faker
import operator
import os
import uuid
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# Initialize Faker
fake = Faker()

# Sample data pools (kept for reference)
sample_positions = [
    "Software Engineer", "Senior Software Engineer", "Lead Developer", "Full Stack Developer",
    "Product Manager", "Senior Product Manager", "Product Owner", "Product Director",
    "UX Designer", "UI/UX Designer", "Senior Designer", "Design Lead",
    "Data Analyst", "Data Scientist", "Data Engineer", "Analytics Lead"
]

sample_statuses = ["Active", "On Leave", "Remote", "Inactive", "Probation", "Contract"]

# Define valid operators and their corresponding functions
OPERATORS = {
    'eq': operator.eq,           # Equal
    'ne': operator.ne,           # Not Equal
    'gt': operator.gt,           # Greater Than
    'lt': operator.lt,           # Less Than
    'ge': operator.ge,           # Greater Than or Equal
    'le': operator.le,           # Less Than or Equal
    'contains': lambda x, y: y.lower() in x.lower(),  # Case-insensitive contains
    'startswith': lambda x, y: x.lower().startswith(y.lower()),  # Case-insensitive starts with
    'endswith': lambda x, y: x.lower().endswith(y.lower()),      # Case-insensitive ends with
    'in': lambda x, y: x in y    # In list
}

def apply_filter(user, filter_condition):
    key = filter_condition.get('key')
    op = filter_condition.get('op', 'eq')
    value = filter_condition.get('value')
    
    if key not in user:
        return True  # Skip invalid keys
        
    if op not in OPERATORS:
        return True  # Skip invalid operators
        
    try:
        return OPERATORS[op](str(user[key]), str(value))
    except (TypeError, ValueError):
        return False

def filter_users(users, filters):
    if not filters:
        return users
        
    filtered_users = users
    for filter_condition in filters:
        filtered_users = [
            user for user in filtered_users 
            if apply_filter(user, filter_condition)
        ]
    
    return filtered_users

def generate_dummy_users(total_users=1000):
    users = []
    for i in range(total_users):
        user = {
            "id": i + 1,
            "name": fake.name(),
            "position": random.choice(sample_positions),
            "address": fake.address().replace('\n', ', '),
            "status": random.choice(sample_statuses),
            "email": fake.email(),
            "phone": fake.phone_number(),
            "department": fake.company_suffix(),
            "hire_date": fake.date_between(start_date='-5y', end_date='today').strftime('%Y-%m-%d'),
            "employee_id": fake.unique.random_number(digits=6)
        }
        users.append(user)
    return users

def sort_users(users, sort_by, order):
    valid_keys = ['id', 'name', 'position', 'status', 'department', 'hire_date', 'employee_id']
    
    if sort_by not in valid_keys:
        sort_by = 'id'
    
    reverse = order.lower() == 'desc'
    return sorted(users, key=lambda x: x[sort_by], reverse=reverse)

@app.route('/api/users', methods=['GET', 'POST'])
def get_users():
    # Get pagination parameters
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 15))
    
    # Get sorting parameters
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    
    # Get filter conditions from POST body
    filters = []
    if request.method == 'POST':
        filters = request.json if request.json else []
    
    # Generate users
    all_users = generate_dummy_users(1000)
    
    # Apply filters
    filtered_users = filter_users(all_users, filters)
    
    # Apply sorting
    sorted_users = sort_users(filtered_users, sort_by, order)
    
    # Calculate pagination
    total_users = len(sorted_users)
    total_pages = math.ceil(total_users / per_page)
    page = min(max(1, page), total_pages) if total_pages > 0 else 1
    
    # Get paginated subset
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_users = sorted_users[start_idx:end_idx]
    
    return jsonify({
        "status": "success",
        "data": paginated_users,
        "pagination": {
            "total_records": total_users,
            "total_pages": total_pages,
            "current_page": page,
            "per_page": per_page,
            "has_next": page < total_pages,
            "has_prev": page > 1
        },
        "sort": {
            "sort_by": sort_by,
            "order": order
        },
        "filters": filters
    })


@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    # Generate users
    all_users = generate_dummy_users(1000)
    
    # Find the user with the given ID
    user = next((user for user in all_users if user["id"] == user_id), None)
    
    if user:
        return jsonify({"status": "success", "data": user})
    else:
        return jsonify({"status": "error", "message": "User not found"}), 404





#-----------------------------------HANDLE-FILE-MANAGER-------------------------------

FILES_DIRECTORY = "generated_files"

# Ensure the directory exists
if not os.path.exists(FILES_DIRECTORY):
    os.makedirs(FILES_DIRECTORY)

# Possible file types and their extensions
FILE_TYPES = {
    "pdf": ".pdf",
    "xls": ".xls",
    "doc": ".doc",
    "ppt": ".ppt",
    "jpeg": ".jpg",
    "png": ".png",
  
}

def generate_dummy_files(total_files=10):
    files = []
    for i in range(total_files):
        file_id = str(uuid.uuid4())

        # Select a random file type
        file_type, file_ext = random.choice(list(FILE_TYPES.items()))

        file_name = f"{fake.word()}{file_ext}"
        file_path = os.path.join(FILES_DIRECTORY, file_name)

        # Create a sample file (only meaningful for text-based types)
        if file_type in ["txt", "pdf", "doc"]:
            with open(file_path, "w") as f:
                f.write(f"Sample content for {file_name}")

        file_metadata = {
            "id": file_id,
            "name": file_name,
            "fileType": file_type,  # ✅ Send only "pdf", "doc", etc.
            "srcUrl": f"/download/{file_name}",
            "size": os.path.getsize(file_path) if os.path.exists(file_path) else random.randint(1000, 500000),  
            "author": {
                "name": fake.name(),
                "email": fake.email(),
                "img": fake.image_url()
            },
            "activities": [
                {
                    "userName": fake.name(),
                    "userImg": fake.image_url(),
                    "actionType": "created",
                    "timestamp": int(time.time())
                }
            ],
            "permissions": [
                {
                    "userName": fake.name(),
                    "userImg": fake.image_url(),
                    "role": "viewer"
                }
            ],
            "uploadDate": int(time.time()),
            "recent": True
        }
        files.append(file_metadata)
    
    return files


@app.route("/api/files", methods=["GET"])
def get_files():
    file_list = generate_dummy_files(10)
    response = {
        "list": file_list,
        "directory": [{"id": "1", "label": "Root"}]
    }
    return jsonify(response)

@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory(FILES_DIRECTORY, filename, as_attachment=True)


# Hardcoded login credentials
ADMIN_EMAIL = "admin-01@ecme.com"
ADMIN_PASSWORD = "123Qwe"

@app.route('/api/sign-in', methods=['POST'])
def sign_in():
    """Handle user sign-in with hardcoded credentials."""
    data = request.get_json()

    if not data or "email" not in data or "password" not in data:
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    email = data["email"]
    password = data["password"]

    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "token": "dummy-token-123"  # You can replace this with a JWT token
        })
    else:
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401



if __name__ == '__main__':
    generate_dummy_users(1000)  # Preload users
    generate_dummy_files(10)  # Preload files
    app.run(debug=True, port=5000)
