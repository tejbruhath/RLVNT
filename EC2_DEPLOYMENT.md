# EC2 Deployment Guide for Echo Chat

This guide will help you deploy the Echo Chat application on an AWS EC2 instance.

## Prerequisites
- An AWS account
- An EC2 instance (Ubuntu 20.04 LTS recommended)
- Domain name (optional but recommended)

## Step 1: Set Up EC2 Instance

1. Launch an EC2 instance with Ubuntu 20.04 LTS
2. Configure security groups to allow:
   - SSH (port 22)
   - HTTP (port 80)
   - HTTPS (port 443) - if using SSL

## Step 2: Initial Server Setup

1. Connect to your EC2 instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-server-ip
   ```

2. Update system packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

## Step 3: Deploy the Application

1. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/echo-chat.git /var/www/echo-chat
   cd /var/www/echo-chat
   ```

2. Copy the deployment files to the server using SCP:
   ```bash
   scp -i your-key.pem deploy.sh nginx.conf ecosystem.config.js ubuntu@your-server-ip:/var/www/echo-chat/
   ```

3. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

4. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

## Step 4: Set Up SSL (Optional but Recommended)

1. Install Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Obtain and install SSL certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. Set up automatic renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## Step 5: Verify Deployment

1. Open your browser and navigate to your server's IP or domain
2. The Echo Chat application should be running

## Maintenance

### Viewing Logs
```bash
# Application logs
pm2 logs

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Updating the Application
1. Pull the latest changes
2. Rebuild and restart:
   ```bash
   cd /var/www/echo-chat
   git pull
   npm install
   npm run build
   pm2 restart all
   ```

## Troubleshooting

- **Port in use**: If you get port conflicts, check running processes with `sudo lsof -i :80`
- **Nginx errors**: Check logs at `/var/log/nginx/error.log`
- **Application issues**: Check PM2 logs with `pm2 logs`

## Security Considerations

1. Regularly update your system packages
2. Use strong passwords and SSH keys
3. Keep your application dependencies updated
4. Configure proper file permissions
5. Set up monitoring and alerts
