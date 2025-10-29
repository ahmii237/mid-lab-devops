# Neon Database Setup Guide

## Step 1: Get Your Neon Database Credentials

1. Go to your Neon Console: https://console.neon.tech
2. Select your project
3. Go to the **Dashboard** or **Connection Details** section
4. You'll find a connection string that looks like this:

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

## Step 2: Extract the Connection Details

From the connection string, extract:

- **Host**: `ep-xxx-xxx.region.aws.neon.tech` (the part after `@` and before `/`)
- **Database Name**: Usually `neondb` (the part after the last `/` and before `?`)
- **Username**: The part after `postgresql://` and before `:`
- **Password**: The part after `:` and before `@`

Example:

```
postgresql://myuser:mypassword123@ep-cool-dawn-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

- Host: `ep-cool-dawn-12345.us-east-2.aws.neon.tech`
- Database: `neondb`
- Username: `myuser`
- Password: `mypassword123`

## Step 3: Update settings.py

Open `Blog/Blog/settings.py` and update the `DATABASES` configuration with your Neon credentials:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',      # Replace with your database name
        'USER': 'your_neon_username',      # Replace with your username
        'PASSWORD': 'your_neon_password',  # Replace with your password
        'HOST': 'your_neon_host',          # Replace with your Neon host
        'PORT': '5432',
        'OPTIONS': {
            'sslmode': 'require',  # Important: Neon requires SSL
        },
    }
}
```

## Step 4: Run Migrations

After updating the database settings, run these commands:

```powershell
# Navigate to the Blog directory (where manage.py is located)
cd "C:\Users\mudas\Documents\mid lab\Blog-django-react-postgres\Blog"

# Make sure your virtual environment is activated
# If not, activate it:
# venv\Scripts\Activate.ps1

# Run migrations to create tables in your Neon database
python manage.py makemigrations
python manage.py migrate

# Create a superuser (admin account)
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

## Step 5: Verify Connection

1. If the server starts successfully, your database connection is working!
2. Visit http://127.0.0.1:8000/admin to access the admin panel
3. Log in with the superuser credentials you just created

## Alternative Method: Using Environment Variables (Recommended for Security)

Instead of hardcoding credentials in settings.py, you can use environment variables:

1. Install `python-decouple` (optional but recommended):

   ```powershell
   pip install python-decouple
   ```

2. Create a `.env` file in the Blog directory:

   ```
   DATABASE_NAME=your_database_name
   DATABASE_USER=your_neon_username
   DATABASE_PASSWORD=your_neon_password
   DATABASE_HOST=your_neon_host
   ```

3. Update settings.py to use environment variables:

   ```python
   from decouple import config

   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': config('DATABASE_NAME'),
           'USER': config('DATABASE_USER'),
           'PASSWORD': config('DATABASE_PASSWORD'),
           'HOST': config('DATABASE_HOST'),
           'PORT': '5432',
           'OPTIONS': {
               'sslmode': 'require',
           },
       }
   }
   ```

## Troubleshooting

### SSL Error

If you get an SSL error, make sure you have:

```python
'OPTIONS': {
    'sslmode': 'require',
}
```

### Connection Timeout

- Check if your Neon project is active (free tier projects may sleep)
- Verify your internet connection
- Check firewall settings

### Authentication Failed

- Double-check your username and password
- Make sure you copied the entire password (no extra spaces)

## Next Steps After Successful Connection

1. ✅ Database connected
2. ✅ Migrations run
3. ✅ Superuser created
4. 🔄 Start building your API endpoints
5. 🔄 Test with the React frontend
6. 🔄 Add data through the admin panel or API

---

**Note**: Keep your database credentials secure! Never commit them to Git. Add `.env` to your `.gitignore` file.
