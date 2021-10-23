import React from 'react'

const Divider =(prop)=>{
    return (
        <div style={{height: '1px', width: '100%', backgroundColor: 'lightgrey', margin: '1rem'}}  />
    )
}


function ListItem(prop) {
    return (
        <>
            <div style={{width: '100%', minWidth: '250px', display: 'flex', justifyContent: 'space-between'}}>
                <span style={{marginRight: '.5rem', fontWeight: 'bold', fontSize: '.85rem'}}>{prop.label}</span> 
                <span style={{fontSize: '.85rem'}}>{prop.value}</span>
            </div>
            <Divider />
        </>
    )
}

export default ListItem
