 export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

 export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

 export const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s'-]{2,80}$/

 export const phoneRegex = /^(\d{1,3})(\d{8,10})$/;

 export const onlyNumbersRegex = /^\d{2,50}$/
 
 export const addressRegex = /^[\p{L}\d\s.,°º#\-]{5,}$/u

 export const propertyNameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s'-]{2,80}$/

 export const observationsRegex = /^[\p{L}\d\s.,°º#\-]{2,}$/u

 export const cuitRegex = /^\d{11}$/

 export const idRegex = /^\d{1,11}$/

