import React from 'react'
import { Field, ErrorMessage } from 'formik'
interface user{
    fieldName:string,
    label:string,
    placeHolder:string
}

const InputFeild = ({fieldName, label,placeHolder}:user) => {
  return (
    <div className=' mx-6 mx-auto text-start flex flex-col gap-1 my-2  px-2 '>
        <label htmlFor={fieldName}  className=' font-semibold'>
            {label}
            </label>
            <Field name={fieldName} id={fieldName} placeholder={placeHolder}  className='border-2 border-gray-400 px-2 py-1 rounded-md w-full' />
            <ErrorMessage name={fieldName} component="div" className=' -mt-2 text-[12px] font-serif text-red-800'/>

    </div>
  )
}

export default InputFeild