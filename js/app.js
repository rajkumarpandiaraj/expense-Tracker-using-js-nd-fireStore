const form = document.querySelector('#form');
const expensesList = document.querySelector('.expenses-list');
const btnDelete = document.querySelector('.btn-delete');
const totalAmount = document.querySelector('#total-amount');
let total = 0

const renderToUi = (doc) =>{
    let li = document.createElement('li');
    li.classList.add('item');
    li.setAttribute('id', doc.id);
    li.innerHTML = `
    <span>${doc.data().expense}</span>
    <span>${doc.data().amount}</span>
    <span>
        <i class='fas fa-trash-alt'></i>
    </span>`;
    
    expensesList.appendChild(li);

    li.addEventListener('click', (e) =>{
        if(e.target.classList.contains('fa-trash-alt')){
            const id = e.target.parentElement.parentElement.id ;
            db.collection('expenses').doc(id).delete();
        }
    })
}

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    db.collection('expenses').add({
        expense : form.expense.value,
        amount : form.amount.value
    });
    form.amount.value = '';
    form.expense.value = ''
});

db.collection('expenses').onSnapshot( snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type === 'added'){
            total += +change.doc.data().amount;
            totalAmount.innerHTML = total
            renderToUi(change.doc);
        }else if(change.type === 'removed'){
            
            total -= +change.doc.data().amount;
            totalAmount.innerHTML = total
            let li = expensesList.querySelector(`#${change.doc.id}`)
            li.remove();
        }
    })
})

btnDelete.addEventListener('click', ()=>{
    db.collection('expenses').get()
    .then(snapshot =>{
    snapshot.docs.forEach(doc =>{
        db.collection("expenses").doc(doc.id).delete()
    })
})
})