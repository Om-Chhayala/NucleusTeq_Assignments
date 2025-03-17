abstract class Vehicle {
    private final String modelName;

    public Vehicle(String modelName) {
        this.modelName = modelName;
    }

    public String getModelName() {
        return modelName;
    }

    public abstract void start();

    public void stop() {
        System.out.println(modelName + " stopped.");
    }

    public void displayInfo() {
        System.out.println("Vehicle Model: " + modelName);
    }
}

class Car extends Vehicle {
    public Car(String modelName) {
        super(modelName);
    }

    @Override
    public void start() {
        System.out.println(getModelName() + " started.");
    }
}

public class Abstract {
    public static void main(String[] args) {
        Car car = new Car("Tesla Model S");
        car.displayInfo();
        car.start();
        car.stop();
    }
}
