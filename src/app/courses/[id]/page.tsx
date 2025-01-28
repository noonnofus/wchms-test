"use client";
import TabsMenu from "@/components/shared/tabs-menu";
import CourseDetailsCard from "@/components/courses/course-details-card";

export default function Home() {
    return (
        <div>
            <TabsMenu
                leftLabel="Course Home"
                rightLabel="Course Exercises"
                leftChildren={
                    <CourseDetailsCard
                        name="第19期：脳の運動教室(シン 脳の運動教室)"
                        description="2025年は、60年に一度巡ってくる「乙巳（きのと・み）」の年。乙巳の年は、新しいものが生まれ、成長していく年と言われています。第19期となる脳の運動教室も、今年は「シン 脳の運動教室」としてブラッシュアップしていきます！皆さま、本年もよろしくお願いいたします。"
                    />
                }
                rightChildren={<></>}
            />
        </div>
    );
}
