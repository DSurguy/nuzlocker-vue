import isDefined from './isDefined.js'
/**
 * 
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