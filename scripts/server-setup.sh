#!/bin/bash

# Server Setup Script for Chat App
# Run this ONCE on your server before first deployment

set -e  # Exit on error

echo "🚀 Starting server setup..."

# Configuration
APP_DIR="/var/www/chat-app"
APP_USER="deploy"
REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO.git"  # UPDATE THIS!

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 This script will:${NC}"
echo "  1. Create application directory"
echo "  2. Clone repository"
echo "  3. Install dependencies"
echo "  4. Setup environment variables"
echo "  5. Install PM2"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Step 1: Create application directory
echo -e "${GREEN}📁 Creating application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR
cd $APP_DIR

# Step 2: Clone repository
echo -e "${GREEN}📦 Cloning repository...${NC}"
if [ -d ".git" ]; then
    echo "Repository already cloned, pulling latest..."
    git pull origin main
else
    echo "Enter your repository URL:"
    read -p "Repository URL: " REPO_URL
    git clone $REPO_URL .
fi

# Step 3: Install Node.js (if not installed)
if ! command -v node &> /dev/null; then
    echo -e "${GREEN}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Step 4: Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm ci

# Step 5: Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo -e "${GREEN}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Step 6: Setup environment file
echo -e "${GREEN}⚙️  Setting up environment variables...${NC}"
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL="postgresql://chatapp_user:your_password@localhost:5432/chatapp?schema=public"
NEXTAUTH_SECRET="change-this-to-random-string"
NEXTAUTH_URL="https://your-domain.com"
JWT_SECRET="change-this-to-random-string"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
OPENROUTER_API_KEY="your-openrouter-key"
NEXT_PUBLIC_SOCKET_URL="https://your-domain.com"
EOF
    echo -e "${YELLOW}⚠️  Please edit .env file with your actual values:${NC}"
    echo "   nano .env"
else
    echo ".env file already exists"
fi

# Step 7: Generate Prisma Client
echo -e "${GREEN}🔧 Generating Prisma Client...${NC}"
npx prisma generate

# Step 8: Create logs directory
echo -e "${GREEN}📝 Creating logs directory...${NC}"
mkdir -p logs

# Step 9: Build application
echo -e "${GREEN}🏗️  Building application...${NC}"
npm run build

# Step 10: Run database migrations
echo -e "${GREEN}🗄️  Running database migrations...${NC}"
echo -e "${YELLOW}⚠️  Make sure PostgreSQL is installed and running!${NC}"
read -p "Run migrations now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma migrate deploy
fi

# Step 11: Start with PM2
echo -e "${GREEN}🚀 Starting application with PM2...${NC}"
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo ""
echo -e "${GREEN}✅ Server setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit .env file: nano .env"
echo "  2. Run migrations: npx prisma migrate deploy"
echo "  3. Restart PM2: pm2 restart chat-app"
echo "  4. Check status: pm2 list"
echo "  5. View logs: pm2 logs chat-app"
echo ""
echo "Your app should be running on http://localhost:3000"
