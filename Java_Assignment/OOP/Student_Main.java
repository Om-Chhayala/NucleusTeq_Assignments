class Student {
    String name;
    int roll_number;
    double marks;

    Student(String name, int roll_number, double marks) {
        this.name = name;
        this.roll_number = roll_number;
        this.marks = marks;
    }

    void display_info() {
        System.out.println("Name: " + name);
        System.out.println("Roll Number: " + roll_number);
        System.out.println("Marks: " + marks);
    }
}

public class Student_Main {
    public static void main(String[] args) {
        Student student = new Student("Om", 101, 85.5);
        student.display_info();
    }
}
