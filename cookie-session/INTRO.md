## cookie-session 认证机制

### cookie
cookie 的运作流程：
- 服务器向客户端发送 cookie。
- 通常使用 HTTP 协议规定的 set-cookie 头操作。
- 规范规定 cookie 的格式为 name = value 格式，且必须包含这部分。
- 浏览器将 cookie 保存。
- 每次请求浏览器都会将 cookie 发向服务器。

其他可选的 cookie 参数会影响将 cookie 发送给服务器端的过程，主要有以下几种：
- path：表示 cookie 影响到的路径，匹配该路径才发送这个 cookie。
- expires 和 maxAge：告诉浏览器这个 cookie 什么时候过期，expires 是 UTC 格式时间，maxAge 是 cookie 多久后过期的相对时间。当不设置这两个选项时，会产生 session cookie，session cookie 是 transient 的，当用户关闭浏览器时，就被清除。一般用来保存 session 的 session_id。
- secure：当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效。
- httpOnly：浏览器不允许脚本操作 document.cookie 去更改 cookie。一般情况下都应该设置这个为 true，这样可以避免被 xss 攻击拿到 cookie。

cookie 的弊端：
- cookie 中的所有数据在客户端可读可写，信息完全暴露给客户端，容易被拦截篡改
- cookie 中数据字段太多会影响传输效率

### session
session 的运作：
session 存放与服务器端，session 的运作通过一个 session_id 来进行。session_id 通常是存放在客户端的 cookie 中，比如在 express 中，默认是 connect.sid 这个字段，当请求到来时，服务端检查 cookie 中保存的 session_id 并通过这个 session_id 与服务器端的 session data 关联起来，进行数据的保存和修改  
当用户访问页面时，服务端随机产生一个 1024bit 长的字符串，然后存在你 cookie 中的 connect.sid 字段中。当你下次访问时，cookie 会带有这个字符串，然后浏览器就知道你是上次访问过的某某某，然后从服务器的存储中取出上次记录在你身上的数据。由于字符串是随机产生的，而且位数足够多，所以也不担心有人能够伪造。