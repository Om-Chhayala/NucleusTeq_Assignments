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
class Graduate_Student extends Student {
    String research_topic;

    Graduate_Student(String name, int roll_number, double marks, String research_topic) {
        super(name, roll_number, marks);
        this.research_topic = research_topic;
    }

    void display_info() {
        super.display_info();
        System.out.println("Research Topic: " + research_topic);
    }
}

public class Student_Graduate_Main {
    public static void main(String[] args) {
        Graduate_Student student = new Graduate_Student("Om", 101, 85.5, "Machine Leaning");
        student.display_info();
    }
}
