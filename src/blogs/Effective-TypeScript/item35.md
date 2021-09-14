- [不要根据数据自己写 Types，而是使用官方 Types](#不要根据数据自己写-types而是使用官方-types)
- [自动生成精确的 Types](#自动生成精确的-types)
- [没有官方的定义和 GraphQL schema？](#没有官方的定义和-graphql-schema)

## 不要根据数据自己写 Types，而是使用官方 Types

TypeScript 的类型对编程的好处不用多说了。在一些情况下，数据来源可能是 `file formats`, `APIs`, or `specs`，如果你直接从数据上“抽象”出 Types，可能会漏掉某些边界情况。

有一个 `GeoJSON` 的例子：

```ts
function calculateBoundingBox(f: GeoJSONFeature): BoundingBox | null {
  let box: BoundingBox | null = null;

  const helper = (coords: any[]) => {
    // ...
  };

  const { geometry } = f;
  if (geometry) {
    helper(geometry.coordinates);
  }

  return box;
}
```

函数入参 `GeoJSONFeature` 没有被精确的定义，只是根据一些数据实例抽象出的定义（假设你是这么做的）。

最好使用 `GeoJSON` 官方的标准定义。

> GeoJSON is also known as RFC 7946. The very readable spec is at <http://geojson.org>.

```shell
$ npm install --save-dev @types/geojson
+ @types/geojson@7946.0.7
```

现在使用官方定义的 Types 替换自己写的类型，TypeScript 马上就报错了：

```ts
import { Feature } from "geojson";

function calculateBoundingBox(f: Feature): BoundingBox | null {
  let box: BoundingBox | null = null;

  const helper = (coords: any[]) => {
    // ...
  };

  const { geometry } = f;
  if (geometry) {
    helper(geometry.coordinates);
    // ~~~~~~~~~~~
    // Property 'coordinates' does not exist on type 'Geometry'
    //   Property 'coordinates' does not exist on type
    //   'GeometryCollection'
  }

  return box;
}
```

问题是因为代码假设 `geometry` 一定会有 `coordinates` 属性，对大多数情况来说是这样的（for many geometries, including points, lines, and polygons），但是 `GeometryCollection` 就没有 `coordinates` 属性。如果函数入参正好是 `GeometryCollection`，就会出现 bug。

可以这样简单处理：

```ts
const { geometry } = f;
if (geometry) {
  if (geometry.type === "GeometryCollection") {
    throw new Error("GeometryCollections are not supported.");
  }
  helper(geometry.coordinates); // OK
}
```

更好的处理是让你的函数能真正支持所有的 geometry 类型：

```ts
const geometryHelper = (g: Geometry) => {
  if (geometry.type === "GeometryCollection") {
    geometry.geometries.forEach(geometryHelper);
  } else {
    helper(geometry.coordinates); // OK
  }
};

const { geometry } = f;
if (geometry) {
  geometryHelper(geometry);
}
```

## 自动生成精确的 Types

GraphQL 是一个用于 API 的查询语言，是一个使用基于类型系统来执行查询的服务端运行时（类型系统由你的数据定义）。

使用 GraphQL 写一个获取信息的接口可能像是这样的：

```
query {
  repository(owner: "Microsoft", name: "TypeScript") {
    createdAt
    description
  }
}
```

结果是：

```json
{
  "data": {
    "repository": {
      "createdAt": "2014-06-17T15:28:39Z",
      "description": "TypeScript is a superset of JavaScript that compiles to JavaScript."
    }
  }
}
```

TypeScript 的 Types 可以和 GraphQL 的模板精确的对应起来。

下面是一个获取公共许可的 GraphQL 接口定义：

```
query getLicense($owner:String!, $name:String!){
  repository(owner:$owner, name:$name) {
    description
    licenseInfo {
      spdxId
      name
    }
  }
}
```

这些信息已经足够构建出 TypeScript 的 Types 了。有很多工具可以帮助你根据 GraphQL 生成 TypeScript Types。以工具 `Apollo` 为例：

```shell
$ apollo client:codegen \
    --endpoint https://api.github.com/graphql \
    --includes license.graphql \
    --target typescript
Loading Apollo Project
Generating query files with 'typescript' target - wrote 2 files
```

产出是这样的：

```ts
export interface getLicense_repository_licenseInfo {
  __typename: "License";
  /** Short identifier specified by <https://spdx.org/licenses> */
  spdxId: string | null;
  /** The license full name specified by <https://spdx.org/licenses> */
  name: string;
}

export interface getLicense_repository {
  __typename: "Repository";
  /** The description of the repository. */
  description: string | null;
  /** The license associated with the repository */
  licenseInfo: getLicense_repository_licenseInfo | null;
}

export interface getLicense {
  /** Lookup a given repository by the owner and repository name. */
  repository: getLicense_repository | null;
}

export interface getLicenseVariables {
  owner: string;
  name: string;
}
```

- 同时生成了请求的入参 `interface` 和请求结果 `interface`
- 精确指出了哪些是必须有的，哪些是可以有的属性（Nullability）
- 自动添加注解

如果查询改变，Types 自动改变，如果 GraphQL 模板改变，Types 也会自动改变。

## 没有官方的定义和 GraphQL schema？

那你只能从 data 中“抽象”出类型了。有一些工具，例如 `quicktype`(<https://quicktype.io/>) 可以帮助你做这件事，但是要注意，无论是自己写还是工具帮助，从 data 中生成类型总是会可能漏掉一些边界情况。

即使你没有注意到，其实你已经开始使用官方定义的接口了，例如 `browser DOM API `。
