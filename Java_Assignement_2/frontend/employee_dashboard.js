const apiUrl = "http://localhost:8080/api/employees";

        function fetchEmployees() {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const container = document.getElementById("employeeContainer");
                    container.innerHTML = "";
                    data.forEach(emp => {
                        const card = `
                            <div class="employee-card">
                                <h3>${emp.name}</h3>
                                <p><strong>Email:</strong> ${emp.email}</p>
                                <p><strong>Department:</strong> ${emp.department}</p>
                                <p><strong>Salary:</strong> $${emp.salary}</p>
                                <button class="btn-edit" onclick="editEmployee(${emp.id}, '${emp.name}', '${emp.email}', '${emp.department}', ${emp.salary})">Edit</button>
                                <button class="btn-delete" onclick="deleteEmployee(${emp.id})">Delete</button>
                            </div>
                        `;
                        container.innerHTML += card;
                    });
                });
        }

        function openModal() {
            document.getElementById("employeeModal").style.display = "flex";
        }

        function closeModal() {
            document.getElementById("employeeModal").style.display = "none";
        }

        function saveEmployee() {
            const id = document.getElementById("employeeId").value;
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const department = document.getElementById("department").value;
            const salary = document.getElementById("salary").value;

            const employeeData = { name, email, department, salary: Number(salary) };

            if (id) {
                fetch(`${apiUrl}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(employeeData)
                }).then(() => {
                    closeModal();
                    fetchEmployees();
                });
            } else {
                fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(employeeData)
                }).then(() => {
                    closeModal();
                    fetchEmployees();
                });
            }
        }

        function deleteEmployee(id) {
            fetch(`${apiUrl}/${id}`, { method: "DELETE" }).then(() => fetchEmployees());
        }

        function editEmployee(id, name, email, department, salary) {
            document.getElementById("employeeId").value = id;
            document.getElementById("name").value = name;
            document.getElementById("email").value = email;
            document.getElementById("department").value = department;
            document.getElementById("salary").value = salary;
            document.getElementById("modalTitle").textContent = "Edit Employee";
            openModal();
        }

        fetchEmployees();