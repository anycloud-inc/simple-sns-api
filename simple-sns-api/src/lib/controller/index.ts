import * as express from 'express'

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

interface RouteItem {
  method: Method
  path: string
  action: string
}

export const useController = (
  router: express.Router,
  controller: new () => any
) => {
  const instance = new controller()
  instance._routes.forEach((route: RouteItem) => {
    const path = instance._basePath + route.path
    router[route.method](path, (instance as any)[route.action].bind(instance))
  })
}

export const Controller = (basePath: string) => {
  // return Class Decorator
  return <T extends new (...args: any[]) => {}>(target: T) => {
    return class RouteController extends target {
      _basePath = basePath

      constructor(...args: any[]) {
        super(...args)
      }
    }
  }
}

export const Get = (path?: string): MethodDecorator => {
  return MethodFactory('get', path)
}

export const Post = (path?: string): MethodDecorator => {
  return MethodFactory('post', path)
}

export const Put = (path?: string): MethodDecorator => {
  return MethodFactory('put', path)
}

export const Patch = (path?: string): MethodDecorator => {
  return MethodFactory('patch', path)
}

export const Delete = (path?: string): MethodDecorator => {
  return MethodFactory('delete', path)
}

const MethodFactory = (method: Method, path?: string) => {
  return (
    target: any,
    property: string | symbol,
    _descriptor: PropertyDescriptor
  ) => {
    target._routes = target._routes ?? []
    target._routes.push({ method, path: path ?? '', action: property })
  }
}
