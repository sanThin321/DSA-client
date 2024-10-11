function formatDate(dateString) {
    if (!dateString) {
      return "No date available"; 
    }
  
    const dateParts = dateString.split('-'); 
    
    if (dateParts.length === 3) {
      const day = dateParts[0].padStart(2, '0');
      const month = dateParts[1].padStart(2, '0');
      let year = parseInt(dateParts[2], 10); 
  
      if (year < 100) {
        year = 2000 + year; 
      }
  
      return `${day}-${month}-${year}`; 
    }
  
    return "Invalid date"; 
  }

  export default formatDate;