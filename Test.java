import java.util.Scanner;  // Import the Scanner class
import java.lang.Math;

public class Test {
    public static void main(String[] args) {
        Scanner myObj = new Scanner(System.in);  // Create a Scanner object

        int N;
        double t1, t2, lm, lh, mm, mh, p, p_final, percentage;
        System.out.println("Enter maximum number of people allowed on the queue");

        N = myObj.nextInt();
        System.out.println("Enter average time between arrivals in minutes");

        t1 = myObj.nextDouble();
        System.out.println("Enter the average time per service in minutes");

        t2 = myObj.nextDouble();

        lm = 1.0/t1;
        lh = 60.0/t1;
        mm = 1.0/t2;
        mh = 60.0/t2;
        p = lm/mm;
        p_final = (Math.pow(p, (N+1)) * (1-p))/ (1-(Math.pow(p, (N+1))));
        percentage = p_final * 100;

        for(int i = 0; i <= N; i++) {
            if(i == 0) {
                double prob = (1-p)/ (1-(Math.pow(p, (N+1))));
                double probPecentage = prob * 100;
                //System.out.println("probability of " + i + "people on the queue: " + prob + " Percentage: " + probPercentage);
                System.out.println("Probability of " + i + " people on the queue: " + prob + " Percentage: " + (prob * 100) + "%");
            } else {
                double prob = (Math.pow(p, i) * (1-p))/ (1-(Math.pow(p, (N+1))));
                double probPercentage = prob * 100;
                //System.out.println("Probability of " + i + " people on the queue: " + prob + " Percentage: " + probPercentage);
                System.out.println("Probability of " + i + " people on the queue: " + prob + " Percentage: " + (prob * 100) + "%");
            }
        }

        System.out.println("Maximum number of people expected on the queue: " + N);
        System.out.println("Average time between arrivals, t1 = " + t1);
        System.out.println("Average service time, t2 = " + t2);
        System.out.println("Computations: ");
        System.out.println("Average number of arrivals per minute: " + lm);
        System.out.println("Average number of arrivals per hour: " + lh);
        System.out.println("Average number of units processed per minute for a continuously busy service facility: " + mm);
        System.out.println("Average number of units processed per hour for a continuously busy service facility: " + mh);
        
        if(percentage >= 75) {
            System.out.println("New server needed, because chances of having more than " + N + " people is " + percentage + "%");
        } else if(percentage >= 50 && percentage < 75) {
            System.out.println("Current server is good enough because chances of having more than " + N + "people is " + percentage + "%");
        } else {
            System.out.println("Queue will perform at its best because the chances of having more than " + N + " people is " + percentage + "%");
        }
    }
}