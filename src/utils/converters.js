export const _convert64 = file => {
    return new Promise(resolve => {
        let reader = new FileReader();

        reader.readAsDataURL(file)
        reader.onload=()=>{
            let baseCode = reader.result;
            console.log("Called", reader);
            resolve(baseCode);
            
        };

    });
};