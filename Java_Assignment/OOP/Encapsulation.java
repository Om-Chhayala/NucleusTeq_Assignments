class Student {
    private String name;
    private int roll_number;
    private double marks;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setRollNumber(int roll_number) {
        this.roll_number = roll_number;
    }

    public int getRollNumber() {
        return roll_number;
    }

    public void setMarks(double marks) {
        if (marks >= 0 && marks <= 100) {
            this.marks = marks;
        } else {
            System.out.println("Invalid marks value.");
        }
    }

    public double getMarks() {
        return marks;
    }
}

public class Encapsulation {
    public static void main(String[] args) {
        Student student = new Student();
        student.setName("Om");
        student.setRollNumber(101);
        student.setMarks(88.5);

        System.out.println("Name: " + student.getName());
        System.out.println("Roll Number: " + student.getRollNumber());
        System.out.println("Marks: " + student.getMarks());
    }
}
