# Environment Variables Template

## Database
DATABASE_URL="postgresql://username:password@localhost:5432/shree_jewellers"

## NextAuth (Security)
# Generate via: openssl rand -base64 32
NEXTAUTH_SECRET="your_secret_here"

## App URLs
# For Local Development:
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

## Google OAuth (Authentication)
GOOGLE_CLIENT_ID="your_google_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_secret"

## Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

## JWT (Custom Authentication)
JWT_SECRET="your_custom_jwt_secret"
