import isDefined from './isDefined.js'

export default function safeSet(target, path, value){
  const parts = path.split('.')
  let ref = target
  for( let part of parts.slice(0,-1) ){
    if( !isDefined(ref[part]) ){
      ref[part] = {}
    }
    ref = ref[part]
  }
  ref[parts.slice(-1)[0]] = value
}