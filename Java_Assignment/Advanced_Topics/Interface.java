interface Shape {
    double getArea();
    double getPerimeter();
}

class Circle implements Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double getArea() {
        return Math.PI * Math.pow(radius, 2);
    }

    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }

    public void display() {
        System.out.printf("Circle - Radius: %.2f, Area: %.2f, Perimeter: %.2f%n",
                radius, getArea(), getPerimeter());
    }
}

public class Interface {
    public static void main(String[] args) {
        Circle circle = new Circle(5);
        circle.display();
    }
}