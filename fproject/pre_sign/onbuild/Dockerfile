# Step1 : Base Images
FROM ubuntu

# Step2 : Install Program 
RUN apt -y update && apt -y install -q nginx && apt -y install vim

# Step3 : File Copy 
COPY index.html /var/www/html
COPY index2.html /var/www/html


# Step4 : Start NGINX 
CMD ["nginx","-g","daemon off;"]
