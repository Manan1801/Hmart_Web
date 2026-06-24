# **HMART Enterprise E-Commerce Platform**

## **Project Overview**

Build a production-ready B2B/B2C e-commerce platform named "HMART" for selling:

* Housekeeping Products  
* Stationery Products  
* Safety Products  
* Security Products  
* Office Pantry Products  
* Sports Products

The platform should support:

1. Customer/Buyer Portal  
2. Admin Portal  
3. Delivery Partner Portal

The application should be scalable, modern, responsive, and enterprise-grade.

---

# **Tech Stack**

Frontend:

* Next.js 15  
* TypeScript  
* Tailwind CSS  
* ShadCN UI  
* Redux Toolkit  
* React Query

Backend:

* Node.js  
* Express.js  
* TypeScript

Database:

* PostgreSQL

ORM:

* Prisma

Authentication:

* JWT  
* Refresh Tokens  
* Role Based Access Control

Storage:

* Cloudinary or AWS S3

Notifications:

* Email via Nodemailer/SendGrid  
* SMS via Twilio

Payments:

* Razorpay  
* Stripe

Deployment:

* Docker  
* Vercel (Frontend)  
* AWS/Render (Backend)

---

# **User Roles**

## **1\. Admin**

Admin can:

* Dashboard analytics  
* View monthly revenue  
* View daily revenue  
* View yearly revenue  
* Total orders  
* Total customers  
* Total products  
* Total categories  
* Total delivery partners  
* Pending orders  
* Completed orders  
* Cancelled orders

### **Product Management**

Admin can:

* Add Product  
* Edit Product  
* Delete Product  
* Enable/Disable Product  
* Manage inventory  
* Manage stock  
* Bulk upload products  
* Import CSV  
* Export CSV

### **Category Management**

Create categories:

* Housekeeping  
* Stationery  
* Safety  
* Security  
* Pantry  
* Sports

Admin can create unlimited subcategories.

### **Order Management**

Admin can:

* View all orders  
* Update order status  
* Assign delivery partner  
* Generate invoice PDF  
* Refund order  
* Cancel order

### **Customer Management**

Admin can:

* View customers  
* Suspend customer  
* View purchase history

### **Delivery Partner Management**

Admin can:

* Add delivery partner  
* Remove delivery partner  
* Assign orders  
* Track deliveries

### **Reports**

Generate:

* Sales reports  
* GST reports  
* Inventory reports  
* Revenue reports

Export:

* PDF  
* Excel

### **Dashboard Charts**

Show:

* Revenue chart  
* Orders chart  
* Product performance chart  
* Customer growth chart  
* Category performance chart

Use Chart.js or Recharts.

---

# **Buyer Portal**

## **Authentication**

* Register  
* Login  
* Forgot Password  
* Reset Password  
* OTP Verification

## **Profile**

* Update profile  
* Change password  
* Manage addresses  
* Wishlist  
* Saved carts

## **Product Features**

* Product listing  
* Product details  
* Product images  
* Product specifications  
* Product reviews  
* Product ratings

## **Search**

Advanced search:

* Product name  
* SKU  
* Category

Filters:

* Price  
* Brand  
* Availability  
* Rating

## **Cart**

* Add to cart  
* Update quantity  
* Remove item  
* Save for later

## **Checkout**

* Address selection  
* Delivery selection  
* Payment selection

Payment methods:

* Razorpay  
* Stripe  
* UPI  
* Credit Card  
* Debit Card  
* Net Banking  
* Cash on Delivery

## **Order Management**

Buyer can:

* View orders  
* Track orders  
* Download invoice  
* Cancel order  
* Return order

## **Notifications**

After order placement:

Send:

Email:

* Order Confirmation  
* Invoice  
* Tracking Link

SMS:

* Order placed  
* Out for delivery  
* Delivered

---

# **Delivery Partner Portal**

## **Login**

* Secure login

## **Dashboard**

Show:

* Assigned orders  
* Delivered orders  
* Pending orders  
* Earnings

## **Order Management**

Delivery partner can:

* Accept order  
* Reject order  
* Mark picked up  
* Mark in transit  
* Mark delivered

## **Tracking**

Update:

* Current status  
* Delivery notes

## **Proof of Delivery**

Upload:

* Customer signature  
* Photo proof

## **Route Management**

Display:

* Delivery address  
* Google Maps integration

---

# **Product Catalog Structure**

## **Housekeeping**

### **Cleaning Chemicals & Solutions**

* Disinfectants  
* Sanitizers  
* Floor Cleaners  
* Glass Cleaners  
* Toilet Cleaners  
* Degreasers  
* Air Fresheners

### **Cleaning Tools & Equipment**

* Brooms  
* Dustpans  
* Mops  
* Buckets  
* Microfiber Cloths  
* Brushes  
* Vacuum Cleaners  
* Squeegees  
* Spray Bottles  
* Housekeeping Trolleys

### **Waste Management**

* Dustbins  
* Trash Bags  
* Toilet Paper

### **PPE**

* Gloves  
* Masks

### **Miscellaneous**

* Sponges  
* Scrubbing Pads  
* Safety Signage

---

## **Stationery**

### **Writing Tools**

* Pens  
* Pencils  
* Markers  
* Highlighters

### **Paper Products**

* Notebooks  
* Notepads  
* Letterheads  
* Envelopes  
* Sticky Notes  
* Index Cards

### **Office Supplies**

* Staplers  
* Paper Clips  
* Rubber Bands  
* Tape  
* Scissors  
* Rulers  
* Folders  
* Binders

### **Desk Accessories**

* Pencil Cases  
* Sharpeners  
* Erasers  
* Organizers

### **Art Supplies**

* Paint  
* Brushes  
* Crayons  
* Colored Pencils

---

## **Safety**

### **PPE**

* Hard Hats  
* Helmets  
* Safety Glasses  
* Goggles  
* Face Shields  
* Ear Plugs  
* Respirators  
* Gloves  
* Safety Shoes  
* Coveralls

### **Industrial Safety**

* Harnesses  
* Lifelines  
* Fire Extinguishers  
* Smoke Detectors  
* Spill Kits

### **Road Safety**

* Traffic Cones  
* Barricade Tape  
* Reflective Jackets  
* First Aid Kits

---

## **Security**

* CCTV Cameras  
* DVR Systems  
* Smart Locks  
* Biometric Devices  
* Alarm Systems  
* Motion Sensors  
* Security Lights  
* Safes  
* Walkie Talkies

---

## **Office Pantry**

### **Beverages**

* Coffee  
* Tea  
* Milk  
* Water  
* Juices

### **Snacks**

* Protein Bars  
* Nuts  
* Cookies  
* Biscuits  
* Chips  
* Crackers

---

## **Sports**

### **Team Sports**

* Football  
* Basketball  
* Volleyball  
* Cricket

### **Fitness**

* Dumbbells  
* Barbells  
* Yoga Mats  
* Resistance Bands

### **Protective Gear**

* Helmets  
* Pads  
* Mouth Guards

### **Apparel**

* Jerseys  
* Running Shoes  
* Gym Bags

---

# **Additional Features**

* Dark Mode  
* Multi-language support  
* GST invoices  
* SEO optimization  
* PWA support  
* Mobile responsive  
* Audit logs  
* Activity history  
* Product recommendations  
* Recently viewed products  
* Coupon system  
* Referral system  
* Loyalty points  
* AI chatbot support

---

# **Deliverables**

Generate:

1. Complete database schema using Prisma.  
2. Complete backend APIs.  
3. Complete frontend pages.  
4. Authentication system.  
5. Role based authorization.  
6. Payment integration.  
7. Email and SMS notification service.  
8. Admin dashboard.  
9. Buyer dashboard.  
10. Delivery partner dashboard.  
11. Docker setup.  
12. Seed data.  
13. README.  
14. Production deployment guide.

Implement everything using clean architecture, reusable components, TypeScript, proper folder structure, validation, logging, testing, and enterprise best practices.

![][image1]

[image1]: <data:image/png;base64,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>