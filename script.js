document.addEventListener('DOMContentLoaded', () => {
    const tableSelect = document.getElementById('tableSelect');
    const orderForm = document.getElementById('orderForm');
    const tableOrders = {
        1: document.getElementById('table1Orders'),
        2: document.getElementById('table2Orders'),
        3: document.getElementById('table3Orders')
    };

    // Load orders when a table is selected
    tableSelect.addEventListener('change', loadOrders);

    // Add order when form is submitted
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addOrder();
    });

    function loadOrders() {
        const selectedTable = tableSelect.value;
        const orderList = tableOrders[selectedTable];
        orderList.innerHTML = ''; // Clear existing orders

        axios.get(`https://crudcrud.com/api/08a8bc8c0a5c4c11b9329ef9ab35dd45/orders?table=${selectedTable}`)
            .then(response => {
                response.data.forEach(order => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.textContent = `${order.dish} - ${order.price} INR`;

                    // Add delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'btn btn-danger btn-sm float-right';
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteOrder(order._id, listItem));

                    listItem.appendChild(deleteButton);
                    orderList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function addOrder() {
        const order = {
            table: tableSelect.value,
            dish: document.getElementById('dish').value,
            price: document.getElementById('price').value
        };

        axios.post('https://crudcrud.com/api/08a8bc8c0a5c4c11b9329ef9ab35dd45/orders', order)
            .then(() => {
                loadOrders();
                orderForm.reset();
            })
            .catch(error => console.error('Error:', error));
    }

    function deleteOrder(orderId, listItem) {
        axios.delete(`https://crudcrud.com/api/08a8bc8c0a5c4c11b9329ef9ab35dd45/orders/${orderId}`)
            .then(() => listItem.remove())
            .catch(error => console.error('Error:', error));
    }
});
