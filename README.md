#### problem description: 
There are three problems addressed in this solution :
 1. Feature to use third party email provider to send mail
 2. Load Balance between third party vendors
 3. Failover between email providers

#### Solution Summary:
Considering to provide a simple and testable solution

Below node stack is used:
1. KOA as a middleware server
2. Node 8.10.0 version having Async/Await feature
3. Sinon library over mocha test framework
4. Axios library for asynchronous http request
5. Bebel used for Transpire

##### Patterns:
1. Memotization pattarn is used to divide load between email providers.
2. ES6 features like default values and destructuring makes code more testable

KOA server instance receives request. After applying body parser as middleware
it validates that the mandatory values recieved. The request is then forwarded
to functions which are wrapper over the third party email provider.

##### Steps:
1. Add file .mailgun.env in package.json directory with value
 
   export MAILGUN_API_KEY='*****'

Add file .sendgrid.env in package.json directory with value

   export SENDGRID_API_KEY='*****'

2. source ./sendgrid.env
 
3. source ./mailgun.env

4. npm test for invoking unit testing

5. npm start for server start

6. Test using curl:

 curl  -X POST "http://localhost:8000/sendmail?to=test@test.com&from=test@test.com&subject=hellosubject&text=hello"


Invoke curl multiple times. It should return values OK and Accepted. OK is send when mailgun
is invoked and Accepted is send when sendgrid is invoked. If OK and Accepted aren
not returned alternatively then one of the mail provider is down.


##### Out of Scope: 
The application keeps on switching between email providers until one sends ok message. if both are down then it will keep on trying until it times out.
