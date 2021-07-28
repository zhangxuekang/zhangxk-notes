# NestJS 笔记

![NestJS](../assets/nestjs_cat.png)

Nest 是一个用于构建高效，可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，内置并完全支持 TypeScript（但仍然允许开发人员使用纯 JavaScript 编写代码）并结合了 OOP（面向对象编程），FP（函数式编程）和 FRP（函数式响应编程）的元素。

在底层，Nest 使用强大的 HTTP Server 框架，如 Express（默认）和 Fastify。Nest 在这些框架之上提供了一定程度的抽象，同时也将其 API 直接暴露给开发人员。这样可以轻松使用每个平台的无数第三方模块。

Nest 提供了一个开箱即用的应用程序架构，允许开发人员和团队创建高度可测试，可扩展，松散耦合且易于维护的应用程序。

## 安装

```shell
$ npm i -g @nestjs/cli
$ nest new project-name
```

## 运行应用程序

| 文件              | 描述                                                          |
| ----------------- | ------------------------------------------------------------- |
| app.controller.ts | 带有单个路由的基本控制器示例。                                |
| app.module.ts     | 应用程序的根模块。                                            |
| main.ts           | 应用程序入口文件。它使用 NestFactory 用来创建 Nest 应用实例。 |

main.ts 包含一个异步函数，它负责引导我们的应用程序：

```ts
import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  await app.listen(3000);
}
bootstrap();
```

启动应用程序

```shell
$ npm run start
```

此命令在 src 目录中的 main.ts 文件中定义的端口上启动 HTTP 服务器。在应用程序运行时, 打开浏览器并访问 http://localhost:3000/。

## 模块

模块是具有 @Module() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来组织应用程序结构。

每个 Nest 应用程序至少有一个模块，即根模块。根模块是 Nest 开始安排应用程序树的地方。事实上，根模块可能是应用程序中唯一的模块，特别是当应用程序很小时，但是对于大型程序来说这是没有意义的。

这是 cli 创建的根模块代码:

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

| 属性        | 说明                                                       |
| ----------- | ---------------------------------------------------------- |
| providers   | 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享 |
| controllers | 必须创建的一组控制器                                       |
| imports     | 导入模块的列表，这些模块导出了此模块中所需提供者           |
| exports     | 由本模块提供并应在其他模块中可用的提供者的子集。           |

## 控制器

控制器负责处理传入的 **请求** 和向客户端返回 **响应** 。

```ts
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

为了创建一个基本的控制器，我们必须使用装饰器。装饰器将类与所需的元数据关联，并使 Nest 能够创建路由映射（将请求绑定到相应的控制器）。

## 提供者

Providers 是 Nest 的一个基本概念。许多基本的 Nest 类可能被视为 provider - service, repository, factory, helper 等等。 他们都可以通过 constructor 注入依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 Nest 运行时系统。 Provider 只是一个用 @Injectable() 装饰器注释的类。

初始项目里的最简单服务代码:

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
}
```

这个服务只提供了一个 `getHello`, 用来返回 `"Hello World!"` 字符串。

该服务被依赖注入到上边的控制器里面，控制器注册在主模块里边。当服务起来后，访问 `http://localhost:3000/` 会看到 `"Hello world!"` 信息。

- [NestJS 官网](https://nestjs.com/)
- [中文文档](https://docs.nestjs.cn/6/introduction)
