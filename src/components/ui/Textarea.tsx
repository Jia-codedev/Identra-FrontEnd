
import React from 'react'

function Textarea({classname, placeholder, value, onChange} : {
    classname: string,
    placeholder?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <textarea 
        className={classname} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange}
    />
  )
}

export default Textarea
 