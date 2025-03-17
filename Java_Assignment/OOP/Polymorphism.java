class Student {
    void show() {
        System.out.println("This is a student.");
    }

    void show(String name) {
        System.out.println("Student Name: " + name);
    }
}

class GraduateStudent extends Student {
    void show() {
        System.out.println("This is a graduate student.");
    }
}

public class Polymorphism {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.show();
        s1.show("Om");

        Student s2 = new GraduateStudent();
        s2.show();
    }
}
