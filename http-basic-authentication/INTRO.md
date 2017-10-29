## 1. HTTP基本认证（`Http Basic Authorization`）
HTTP基本认证（`Http Basic Authorization`）是一种用来允许网页浏览器或其他客户端程序在请求时提供用户名和口令形式的身份凭证的一种登录验证方式。  
在发送之前是以用户名追加一个冒号然后串接上口令，并将得出的结果字符串再用`Base64`算法编码。例如，提供的用户名是`Aladdin`、口令是`open sesame`，则拼接后的结果就是`Aladdin:open sesame`，然后再将其用`Base64`编码，得到`QWxhZGRpbjpvcGVuIHNlc2FtZQ==`。最终将Base64编码的字符串发送出去，由接收者解码得到一个由冒号分隔的用户名和口令的字符串。  
```js
res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
res.writeHead(401, {'Content-Type': 'text/plain'});
```
`WWW-Authenticate`头的属性值为`<type> realm=<realm>`：`<type>` 指的是验证的方案（“基本验证方案”是最常见的验证方案，即`Basic`）。`realm` 用来描述进行保护的区域，或者指代保护的范围。它可以是类似于 "Access to the staging site" 的消息，这样用户就可以知道他们正在试图访问哪一空间。
同时返回状态码 `401 Unauthorized`，告诉客户端请求未被授权。

基本认证的一个优点是基本上所有流行的网页浏览器都支持基本认证。缺点是如果没有使用SSL/TLS这样的传输层安全的协议，那么以明文传输的密钥和口令很容易被拦截。该方案也同样没有对服务器返回的信息提供保护。基本认证很少在可公开访问的互联网网站上使用，有时候会在小的私有系统中使用（如路由器网页管理接口）。后来的机制(HTTP摘要认证)[https://zh.wikipedia.org/wiki/HTTP%E6%91%98%E8%A6%81%E8%AE%A4%E8%AF%81]是为替代基本认证而开发的，允许密钥以相对安全的方式在不安全的通道上传输。