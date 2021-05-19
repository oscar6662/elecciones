import React, { useState, useEffect } from 'react';
import { Formik } from "formik";
import Load from './Load';
export default function FormPage(){
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      if (json.loggedIn === true) {
        const r = await fetch('/api/user/');
        const j = await r.json();
        console.log(j);
        setData(j);
      }
      setIsLoading(false);
    };
    fetchData();
  },[true]);


  return(
    
     
<>
     {isLoading ?(
      <Load></Load>
    ):(
      
      <Formik
       initialValues={{ name: data.personal.name_full, id: data.cid, email: data.personal.email }}
       validate={values => {
         const errors = {};
         if (!values.email) {
           errors.email = 'Required';
         } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
         ) {
           errors.email = 'Invalid email address';
         }
         return errors;
       }}
       onSubmit={(values, { setSubmitting }) => {
         setTimeout(() => {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              name: values.name,
              id: values.id,
              email: values.email,
              text: values.text,
            })
        };
        fetch('/api/candidate', requestOptions)
            .then(response => response.json())
            .then(response => console.log(response));
           setSubmitting(false);
         }, 400);
       }}
     >
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         /* and other goodies */
       }) => (
         <form onSubmit={handleSubmit}>
           <label className="row">Datos Personales</label><hr></hr>
           <label>Nombre:</label>
           <input
             type="name"
             name="name"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.name}
             disabled
           />
           <label>CID:</label>
           <input
             type="name"
             name="id"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.id}
             disabled
           />
           <label>E-mail:</label>
           <input
             type="email"
             name="email"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.email}
           />
           {errors.email && touched.email && errors.email}
           <label className="row">Propuestas</label><hr></hr>
           <textarea
             type="text"
             name="propuestas"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.propuestas}
           /><br></br>
           <button type="submit" disabled={isSubmitting}>
             Submit
           </button>
         </form>
       )}
     </Formik>
    )}
     
   </>
    
  );
}
