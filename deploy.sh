#!/bin/bash

# Exit on error
set -e

# Update package list and upgrade packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt-get install -y nginx nodejs npm build-essential

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "Setting up application directory..."
sudo mkdir -p /var/www/echo-chat
sudo chown -R $USER:$USER /var/www/echo-chat

# Navigate to app directory
echo "Navigating to app directory..."
cd /var/www/echo-chat

# Clone repository (or copy files)
# Uncomment and modify the following line if using Git
# git clone <your-repository-url> .

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Set up PM2
echo "Setting up PM2..."
if [ ! -f /etc/init.d/pm2-init.sh ]; then
    sudo pm2 startup
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER
fi

# Start the application with PM2
echo "Starting the application..."
if pm2 list | grep -q "echo-chat"; then
    pm2 restart ecosystem.config.js --env production
else
    pm2 start ecosystem.config.js --env production
fi

# Save PM2 process list
echo "Saving PM2 process list..."
sudo pm2 save

# Set up Nginx
echo "Configuring Nginx..."
sudo rm -f /etc/nginx/sites-enabled/default
sudo cp nginx.conf /etc/nginx/sites-available/echo-chat
sudo ln -sf /etc/nginx/sites-available/echo-chat /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

echo "Deployment completed successfully!"
echo "Your application should now be running at http://your_server_ip"
