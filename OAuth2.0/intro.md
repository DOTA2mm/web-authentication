## `OAuth2.0` (开放授权(Open Authorization))

协议出自[RFC 6749](http://www.rfcreader.com/#rfc6749)  
`OAuth1.0` 因各种问题被淘汰，`OAuth2.0`不向后兼容

开放授权：  
> 如果你开车去酒店赴宴，你经常会苦于找不到停车位而耽误很多时间。是否有好办法可以避免这个问题呢？有的，听说有一些豪车的车主就不担心这个问题。豪车一般配备两种钥匙：主钥匙和泊车钥匙。当你到酒店后，只需要将泊车钥匙交给服务生，停车的事情就由服务生去处理。与主钥匙相比，这种泊车钥匙的使用功能是受限制的：它只能启动发动机并让车行驶一段有限的距离，可以锁车，但无法打开后备箱，无法使用车内其他设备。这里就体现了一种简单的“开放授权”思想：通过一把泊车钥匙，车主便能将汽车的部分使用功能（如启动发动机、行驶一段有限的距离）授权给服务生。

### 协议的参与者
OAuth的四个参与实体： 
- `RO (resource owner)`: 资源所有者，对资源具有授权能力的人。
- `Client`: 第三方应用，它获得RO的授权后便可以去访问RO的资源。
- `AS (authorization server)`: 授权服务器，它认证RO的身份，为RO提供授权审批流程，并最终颁发授权令牌(Access Token)。读者请注意，为了便于协议的描述，这里只是在逻辑上把AS与RS区分开来；在物理上，AS与RS的功能可以由同一个服务器来提供服务。
- `RS (resource server)`: 资源服务器，它存储资源，并处理对资源的访问请求。

### OAuth 2.0的运行流程
```
     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+

                     Figure 1: Abstract Protocol Flow
```
- （A）用户打开客户端以后，客户端要求用户给予授权。
- （B）用户同意给予客户端授权。
- （C）客户端使用上一步获得的授权，向认证服务器申请令牌。
- （D）认证服务器对客户端进行认证以后，确认无误，同意发放令牌。
- （E）客户端使用令牌，向资源服务器申请获取资源。
- （F）资源服务器确认令牌无误，同意向客户端开放资源。
重点： B步骤，用户怎样才能给于客户端授权。有了这个授权以后，客户端就可以获取令牌，进而凭令牌获取资源。

### 授权模式
客户端必须得到用户的授权（`authorization grant`），才能获得令牌（`access token`）。OAuth 2.0定义了四种授权方式:
- 授权码模式（`authorization code`）
- 简化模式（`implicit`）
- 密码模式（`resource owner password credentials`）
- 客户端模式（`client credentials`）

### 授权码模式（`authorization code`）
特点： 功能最完整、流程最严密的授权模式。通过客户端的后台服务器，与"服务提供商"的认证服务器（`AS (authorization server)`）授权服务器行互动。

```
     +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)
```

- （A）用户访问客户端，后者将前者导向认证服务器。
- （B）用户选择是否给予客户端授权。
- （C）假设用户给予授权，认证服务器将用户导向客户端事先指定的"重定向URI"（redirection URI），同时附上一个授权码。
- （D）客户端收到授权码，附上早先的"重定向URI"，向认证服务器申请令牌。这一步是在客户端的后台的服务器上完成的，对用户不可见。
- （E）认证服务器核对了授权码和重定向URI，确认无误后，向客户端发送访问令牌（access token）和更新令牌（refresh token）。

#### 步骤所需要的参数
A步骤中，客户端申请认证的URI，包含以下参数：
- `response_type`：表示授权类型，必选项，此处的值固定为"code"
- `client_id`：表示客户端的ID，必选项
- `redirect_uri`：表示重定向URI，可选项
- `scope`：表示申请的权限范围，可选项
- `state`：表示客户端的当前状态，可以指定任意值，认证服务器会原封不动地返回这个值。

例如：
```http
GET /authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
Host: server.example.com
```
C步骤中，  
如果用户同意授权，服务器回应客户端的URI，包含以下参数：
- `code`：表示授权码，必选项。该码的有效期应该很短，通常设为10分钟，客户端只能使用该码*一次*，否则会被授权服务器拒绝。该码与客户端ID和重定向URI，是一一对应关系。
- `state`：如果客户端的请求中包含这个参数，认证服务器的回应也必须一模一样包含这个参数。  

例如：
```http
HTTP/1.1 302 Found
Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA&state=xyz
```
如果用户不同意授权，服务器回应客户端的URI，包含以下参数：  
- `error`: 错误类型，必选项。有如下几种值：
  - `invalid_request` 无效的请求
  - `unauthorized_client` 未授权的客户端
  - `access_denied` RO拒绝了授权
  - `unsupported_response_type` AS不支持该授权模式
  - `invalid_scope` 无效的授权范围
  - `server_error` AS错误
  - `temporarily_unavailable` AS暂时不可用
（以上除了授权被拒，其他通常由AR在授权页给出错误提示而不是重定向到`redirect_uri`）
- `error_description`: 错误描述，帮助 client 开发人员理解错误，可选项。
- `error_uri`: 错误页地址，可选项。
- `state`: 客户端请求参数带的state，可选项

D步骤中，客户端向认证服务器申请令牌的HTTP请求，包含以下参数：
- `grant_type`：表示使用的授权模式，必选项，此处的值固定为"authorization_code"。
- `code`：表示上一步获得的授权码，必选项。
- `redirect_uri`：表示重定向URI，必选项，且必须与A步骤中的该参数值保持一致。
- `client_id`：表示客户端ID，必选项。  

例如：
```http
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
```
E步骤中，认证服务器发送的HTTP回复，包含以下参数：
- `access_token`：表示访问令牌，必选项。
- `token_type`：表示令牌类型，该值大小写不敏感，必选项，可以是bearer类型或mac类型。
- `expires_in`：表示过期时间，单位为秒。如果省略该参数，必须其他方式设置过期时间。
- `refresh_token`：表示更新令牌，用来获取下一次的访问令牌，可选项。
- `scope`：表示权限范围，如果与客户端申请的范围一致，此项可省略。

例如：  
```http
     HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8
     // 响应头中指定不缓存结果
     Cache-Control: no-store 
     Pragma: no-cache

     {
       "access_token":"2YotnFZFEjr1zCsicMWpAA",
       "token_type":"example",
       "expires_in":3600,
       "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
       "example_parameter":"example_value"
     }
```
授权码模式的实例：  
![实例](./oauth.jpg)  
### 参考连接
[帮你深入理解OAuth2.0协议](http://blog.csdn.net/seccloud/article/details/8192707)  
[理解OAuth 2.0](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)  
[GitHub-oauthjs/node-oauth2-server](https://github.com/oauthjs/node-oauth2-server)
