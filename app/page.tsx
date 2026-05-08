import HeroSection from './components/HeroSection';
import StudyPrograms from './components/StudyPrograms';
import Advantages from './components/Advantages';
import ProfessionalClass from './components/ProfessionalClass';
import Scholarships from './components/Scholarships';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StudyPrograms />
      <Advantages />
      <ProfessionalClass />
      <Scholarships />
    </main>
  );
}