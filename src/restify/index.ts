import { IRouter } from "express"
import http from "http"

interface RestifyOption {
  name: string
  prefix: string
  version: string
  idProperty: string
  findOneAndUpdate: boolean
  findOneAndRemove: boolean
  lean: boolean
  restify: boolean
  runValidators: boolean
  allowRegex: boolean
  upsert: boolean
  access: Function
  private: any[]
  protected: any[]
  filter: any
  contextFilter: any
  onError: any
  outputFn: any

  modelFactory: { getModel: Function }
  preMiddleware: any
  preCreate: any
  preRead: any
  preUpdate: any
  preDelete: any
  /*postCreate: any
  postRead: any
  postUpdate: any
  postDelete: any*/
  readPreference: string
  totalCountHeader:string|boolean
  postProcess:Function
}
const util = require('util')
const Filter = require('./resource_filter')
const excludedMap = {}

export const restify = function (app: IRouter, model, opts: RestifyOption) {
  const options = Object.assign({}, {
    prefix: '/api',
    version: '/v1',
    idProperty: '_id',
    findOneAndUpdate: true,
    findOneAndRemove: true,
    lean: true,
    restify: false,
    runValidators: false,
    allowRegex: true,
    private: [],
    protected: [],
    upsert: false,
    preMiddleware: [],
    preCreate: [],
    preRead: [],
    preUpdate: [],
    preDelete: [],
    /*postCreate: [],
    postRead: [],
    postUpdate: [],
    postDelete: [],*/
    totalCountHeader:true,
  }, opts)

  const ensureContentType = function ensureContentType(req, res, next) {
    const ct = req.headers['content-type']
    if (!ct) return next(new Error('missing_content_type'))
    if (ct.indexOf('application/json') === -1) return next(new Error('invalid_content_type'))
    next()
  }

  const filterAndFindById = function (req, res, next) {
    const contextModel = (req.erm && req.erm.model) || model
    if (!req.params.id) return next()

    options.contextFilter(contextModel, req, (filteredContext) => {
      filteredContext.findOne()
        .and({ [options.idProperty]: req.params.id }).lean(false).read(options.readPreference || 'p').exec().then((doc) => {
          if (!doc) return next(new Error(http.STATUS_CODES[404]))
          req.erm.document = doc
          next()
        }, next)
    })
  }
  const prepareQuery = require('./middleware/prepareQuery')(options)
  const prepareOutput = function (req, res, next) {
    /*const postMiddleware:any[] = (() => {
      switch (req.method.toLowerCase()) {
        case 'get': return options.postRead
        case 'post': return req.erm.statusCode === 201 ? options.postCreate : options.postUpdate
        case 'put':
        case 'patch': return options.postUpdate
        case 'delete': return options.postDelete
      }
    })()*/

    //const callback = (err) => {
    //  if (err) return next(err)
    // TODO: this will, but should not, filter /count queries
    if (req.erm.result) {
      const opts = { access: req.access, excludedMap: excludedMap, populate: req.erm && req.erm.query ? req.erm.query.populate : null }
      req.erm.result = options.filter ? options.filter.filterObject(req.erm.result, opts) : req.erm.result
    }

    if (options.totalCountHeader && req.erm.totalCount !== 'undefined')
      res.header(typeof options.totalCountHeader === 'string' ? options.totalCountHeader : 'X-Total-Count', req.erm.totalCount)

    const promise = options.outputFn(req, res)
    if (options.postProcess) {
      if (typeof promise?.then === 'function') promise.then(() => { options.postProcess(req, res) }).catch(next)
      else options.postProcess(req, res)
    }
    // }//
    //if (!postMiddleware || postMiddleware.length === 0) return callback()
    //runSeries(postMiddleware.map((middleware, i) => (cb) => middleware(req, res, cb)), callback)
  }

  if (!Array.isArray(options.private)) throw new Error('"options.private" must be an array of fields')
  if (!Array.isArray(options.protected)) throw new Error('"options.protected" must be an array of fields')

  model.schema.eachPath((name, path) => {
    if (path.options.access) {
      switch (path.options.access.toLowerCase()) {
        case 'private': options.private.push(name)
          break
        case 'protected': options.protected.push(name)
          break
      }
    }
  })

  options.filter = new Filter({ model, excludedMap, filteredKeys: { private: options.private, protected: options.protected } })

  excludedMap[model.modelName] = options.filter.filteredKeys

  options.contextFilter ||= (model, req, done) => done(model)
  options.onError ||= function (err: Error, req, res, next) {
    if (!options.restify) res.status(req.erm.statusCode).json(err.message)
    else res.send(req.erm.statusCode, err.message)
  }

  options.outputFn ||= function output(req, res) {
    if (!options.restify) {
      if (req.erm.result) res.status(req.erm.statusCode).json(req.erm.result)
      else res.sendStatus(req.erm.statusCode)
    } else res.send(req.erm.statusCode, req.erm.result)
  }

  options.name = options.name || model.modelName
  const ops = require('./operations')(model, options, excludedMap)
  let uriItem = `${options.prefix}${options.version}/${options.name}`
  if (uriItem.indexOf('/:id') === -1) {
    uriItem += '/:id'
  }
  const uriItems = uriItem.replace('/:id', '')

  app.use((req, res, next) => {
    const getModel = options.modelFactory?.getModel
    req['erm'] = { model: typeof getModel === 'function' ? getModel(req) : model }
    next()
  })

  const accessMiddleware = options.access ? function (req, res, next) {
    const handler = function (err, access) {
      if (err) return next(new Error(err))
      if (['public', 'private', 'protected'].indexOf(access) < 0) return next(new Error('Unsupported access, must be "private", "protected" or "public"'))
      req.access = access
      next()
    }
    if (options.access.length > 1) options.access(req, handler)
    else handler(null, options.access(req))
  } : []

  app.get(uriItems, prepareQuery, options.preMiddleware, options.preRead, accessMiddleware, ops.getItems, prepareOutput)
  app.get(uriItems + '/count', prepareQuery, options.preMiddleware, options.preRead, accessMiddleware, ops.getCount, prepareOutput)
  app.get(uriItem, prepareQuery, options.preMiddleware, options.preRead, accessMiddleware, ops.getItem, prepareOutput)
  app.get(uriItem + '/shallow', prepareQuery, options.preMiddleware, options.preRead, accessMiddleware, ops.getShallow, prepareOutput)

  app.post(uriItems, prepareQuery, ensureContentType, options.preMiddleware, options.preCreate, accessMiddleware, ops.createObject, prepareOutput)
  app.post(uriItem, util.deprecate(prepareQuery, 'express-restify-mongoose: in a future major version, the POST method to update resources will be removed. Use PATCH instead.'), ensureContentType, options.preMiddleware, options.findOneAndUpdate ? [] : filterAndFindById, options.preUpdate, accessMiddleware, ops.modifyObject, prepareOutput)

  app.put(uriItem, util.deprecate(prepareQuery, 'express-restify-mongoose: in a future major version, the PUT method will replace rather than update a resource. Use PATCH instead.'), ensureContentType, options.preMiddleware, options.findOneAndUpdate ? [] : filterAndFindById, options.preUpdate, accessMiddleware, ops.modifyObject, prepareOutput)
  app.patch(uriItem, prepareQuery, ensureContentType, options.preMiddleware, options.findOneAndUpdate ? [] : filterAndFindById, options.preUpdate, accessMiddleware, ops.modifyObject, prepareOutput)

  app.delete(uriItems, prepareQuery, options.preMiddleware, options.preDelete, ops.deleteItems, prepareOutput)
  app.delete(uriItem, prepareQuery, options.preMiddleware, options.findOneAndRemove ? [] : filterAndFindById, options.preDelete, ops.deleteItem, prepareOutput)

  return uriItems
}
