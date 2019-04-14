import isDefined from './isDefined.js'
/**
 * Lookup an nested property on an object, using
 *  a period-delimited path string
 * 
 * If the property does not exist, or any of the 
 *  properties on the path does not exist, the 
 *  default value (or undefined) will be returned
 * @param {Object} source 
 * @param {String} path 
 * @param {*} [defaultValue] 
 */
export default function safeGet(source, path, defaultValue=undefined){
  if( !source ) return defaultValue
  const parts = path.split('.')
  let ref = source
  while(isDefined(ref) && parts.length){
    ref = ref[parts.shift()]
  }
  return ref || defaultValue
}