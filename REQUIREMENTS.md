## API Endpoints
### Products

|  | Method | URL | Query params | Token Required | Body |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Index | GET | `/products` | | false |  |
| Show | GET | `/products/:id` | | false |  |
| Create | POST | `/products` | | true | { "name": "Scarf", <br> "price": "6000", <br> "category": "accessories" } |
| Delete | DELETE | `/products/:id` | | true | |
| Top products | GET | `/top-products` | `?limit=<number>` <br> Default limit: 5 | false |  |


### Users

|  | Method | URL | Query params |Token Required | Body |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Index | GET | `/users` | | true |  |
| Show | GET | `/users/:id` | | true |  |
| Create | POST | `/users` | | true | { "firstName": "John", <br> "lastName": "Doe", <br> "email": "johndoe@test.com", <br> "password": "secret" } |
| Authentication | POST | `/authenticate` | | false | { "email": "johndoe@test.com", <br> "password": "secret" } |

### Orders

|  | Method | URL | Query params |Token Required | Body |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Current order by user | GET | `/users/:userId/orders` | `?status=complete` | true |  |
| Completed orders by user | GET | `/users/:userId/orders` | `?status=active` | true |  |
| Mark order as complete | PATCH | `/users/:userId/orders/:orderId/complete` | | true |  |


## Data Shapes
### Product
- id
- name
- price
- category

### User
- id
- first_name
- last_name
- email
- password

### Orders
- id
- products
  - id of each product in the order
  - quantity of each product in the order
- user_id
- status (active or complete)

## Database Tables
### Products Table

| id | name | price | category |
| :---: | :---: | :---: | :---: |
| SERIAL <br /> [Primary key]  | VARCHAR | MONEY | VARCHAR |

### Users Table
| id | first_name | last_name | email | password_digest |
| :---: | :---: | :---: | :---: | :---: |
| SERIAL <br /> [Primary key]  | VARCHAR | VARCHAR | VARCHAR | VARCHAR |

### Orders Table
| id | status | user_id |
| :---: | :---: | :---: |
| SERIAL <br /> [Primary key]  | VARCHAR | BIGINT <br />[Foreign key to users table] |

### Order Products table
| id | quantity | order_id | product_id |
| :---: | :---: | :---: | :---: |
| SERIAL <br /> [Primary key] | INTEGER | BIGINT <br /> [Foreign key to orders table] | BIGINT <br /> [Foreign key to products table] |
