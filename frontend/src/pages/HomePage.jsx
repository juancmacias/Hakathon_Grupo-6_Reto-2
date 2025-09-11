import React from 'react';
import { MessageCircle, Map, Gift, Sparkles, Calendar, MapPin } from 'lucide-react';
import Button from '../components/common/Button';
import Card, { CardTitle, CardContent } from '../components/common/Card';
import { COLORS } from '../config/constants';
import { getTimeBasedGreeting } from '../utils/dateUtils';

/**
 * Página principal de la aplicación
 * Muestra opciones principales y actividades sugeridas
 * @param {Object} props
 * @param {Object} props.userProfile - Perfil del usuario
 * @param {function} props.onNavigate - Función de navegación
 * @param {function} props.getPersonalizedGreeting - Función para obtener saludo personalizado
 */
const HomePage = ({ userProfile, onNavigate, getPersonalizedGreeting }) => {
  
  /**
   * Obtiene el juego o actividad del día según el tipo de usuario
   */
  const getDailyActivity = () => {
    const isChild = userProfile.type === 'child';
    const isEnglish = userProfile.language === 'en';
    
    const childActivities = {
      es: [
        "🔍 Encuentra 3 lugares en Madrid donde pueda esconder mis moneditas mágicas",
        "🎭 Descubre qué estatua guarda el secreto del tesoro perdido",
        "🌟 Busca las 5 ventanas más bonitas del Palacio Real",
        "🐭 Ayúdame a encontrar el mejor escondite para mis aventuras"
      ],
      en: [
        "🔍 Find 3 places in Madrid where I can hide my magical coins",
        "🎭 Discover which statue guards the secret of the lost treasure",
        "🌟 Look for the 5 most beautiful windows of the Royal Palace",
        "🐭 Help me find the best hiding place for my adventures"
      ]
    };

    const parentActivities = {
      es: [
        "📚 Ruta educativa: Descubra la historia del Madrid de los Austrias",
        "🏛️ Visita cultural: Los museos más familiares de la ciudad",
        "🚶‍♂️ Paseo temático: Arquitectura y leyendas madrileñas",
        "🎨 Experiencia artística: Arte y cultura para toda la familia"
      ],
      en: [
        "📚 Educational route: Discover the history of Habsburg Madrid",
        "🏛️ Cultural visit: The most family-friendly museums in the city",
        "🚶‍♂️ Themed walk: Architecture and Madrid legends",
        "🎨 Artistic experience: Art and culture for the whole family"
      ]
    };

    const activities = isChild ? childActivities : parentActivities;
    const languageActivities = activities[isEnglish ? 'en' : 'es'];
    
    return languageActivities[Math.floor(Math.random() * languageActivities.length)];
  };

  /**
   * Obtiene recomendaciones basadas en la hora del día
   */
  const getTimeBasedRecommendation = () => {
    const hour = new Date().getHours();
    const isChild = userProfile.type === 'child';
    const isEnglish = userProfile.language === 'en';

    if (hour < 12) {
      return isEnglish
        ? (isChild ? "Perfect morning for a treasure hunt in Retiro Park!" : "Great time to visit museums before they get crowded")
        : (isChild ? "¡Mañana perfecta para buscar tesoros en el Retiro!" : "Buen momento para visitar museos antes de las multitudes");
    } else if (hour < 18) {
      return isEnglish
        ? (isChild ? "Afternoon adventure at Plaza Mayor awaits!" : "Ideal time for a family walk through historic Madrid")
        : (isChild ? "¡Aventura de tarde en la Plaza Mayor te espera!" : "Momento ideal para un paseo familiar por el Madrid histórico");
    } else {
      return isEnglish
        ? (isChild ? "Evening magic at Templo de Debod!" : "Beautiful sunset views from Madrid's rooftops")
        : (isChild ? "¡Magia nocturna en el Templo de Debod!" : "Hermosas vistas del atardecer desde las azoteas de Madrid");
    }
  };

  return (
    <div 
      className="min-h-screen p-6"
      style={{ backgroundColor: COLORS.BACKGROUND }}
    >
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Encabezado de bienvenida */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center animate-bounce-soft"
              style={{ backgroundColor: COLORS.PRIMARY_YELLOW }}
            >
              <Gift 
                className="w-10 h-10"
                style={{ color: COLORS.SECONDARY_RED }} 
              />
            </div>
            <Sparkles 
              className="absolute -top-2 -right-2 w-6 h-6 animate-pulse-glow"
              style={{ color: COLORS.SECONDARY_BLUE }} 
            />
          </div>
          
          <h1 
            className="text-3xl font-bold font-title mb-2"
            style={{ color: COLORS.PRIMARY_BROWN }}
          >
            {getPersonalizedGreeting()}
          </h1>
          
          <p 
            className="font-body text-lg"
            style={{ color: COLORS.BLACK }}
          >
            {userProfile.language === 'en'
              ? "I'm the Tooth Mouse and I'm here to show you the magical secrets of Madrid"
              : "Soy el Ratoncito Pérez y estoy aquí para mostrarte los secretos mágicos de Madrid"
            }
          </p>
        </div>

        {/* Opciones principales de navegación */}
        <Card>
          <CardTitle>
            {userProfile.language === 'en' 
              ? 'What do you want to discover today?' 
              : '¿Qué quieres descubrir hoy?'
            }
          </CardTitle>
          
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Botón Chat */}
              <Button
                variant="primary"
                onClick={() => onNavigate('chat')}
                className="h-20 flex-col gap-2"
              >
                <MessageCircle 
                  className="w-8 h-8"
                  style={{ color: COLORS.SECONDARY_RED }} 
                />
                <span className="text-sm font-semibold">
                  {userProfile.language === 'en' ? 'Chat' : 'Chatear'}
                </span>
              </Button>

              {/* Botón Mapa */}
              <Button
                variant="primary"
                onClick={() => onNavigate('map')}
                className="h-20 flex-col gap-2"
              >
                <Map 
                  className="w-8 h-8"
                  style={{ color: COLORS.SECONDARY_RED }} 
                />
                <span className="text-sm font-semibold">
                  {userProfile.language === 'en' ? 'Map' : 'Mapa'}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actividad del día */}
        <Card hoverable>
          <CardContent>
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: COLORS.SECONDARY_BLUE }}
            >
              <div className="flex items-start gap-3">
                <Calendar 
                  className="w-6 h-6 flex-shrink-0 mt-1"
                  style={{ color: COLORS.WHITE }} 
                />
                <div>
                  <h3 
                    className="font-bold font-title mb-2"
                    style={{ color: COLORS.WHITE }}
                  >
                    {userProfile.language === 'en' 
                      ? '🎮 Activity of the Day' 
                      : '🎮 Actividad del Día'
                    }
                  </h3>
                  <p 
                    className="text-sm font-body"
                    style={{ color: COLORS.WHITE }}
                  >
                    {getDailyActivity()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendación basada en la hora */}
        <Card>
          <CardContent>
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: COLORS.PRIMARY_YELLOW }}
            >
              <div className="flex items-start gap-3">
                <MapPin 
                  className="w-6 h-6 flex-shrink-0 mt-1"
                  style={{ color: COLORS.PRIMARY_BROWN }} 
                />
                <div>
                  <h3 
                    className="font-bold font-title mb-2"
                    style={{ color: COLORS.PRIMARY_BROWN }}
                  >
                    {userProfile.language === 'en' 
                      ? '💡 Tip of the moment' 
                      : '💡 Consejo del momento'
                    }
                  </h3>
                  <p 
                    className="text-sm font-body"
                    style={{ color: COLORS.BLACK }}
                  >
                    {getTimeBasedRecommendation()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas de aventura para niños */}
        {userProfile.type === 'child' && (
          <Card>
            <CardTitle size="md">
              {userProfile.language === 'en' ? '🏆 Your Adventures' : '🏆 Tus Aventuras'}
            </CardTitle>
            
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div 
                    className="text-2xl font-bold font-title"
                    style={{ color: COLORS.SECONDARY_RED }}
                  >
                    3
                  </div>
                  <div 
                    className="text-xs font-body"
                    style={{ color: COLORS.BLACK }}
                  >
                    {userProfile.language === 'en' ? 'Places' : 'Lugares'}
                  </div>
                </div>
                <div>
                  <div 
                    className="text-2xl font-bold font-title"
                    style={{ color: COLORS.SECONDARY_BLUE }}
                  >
                    7
                  </div>
                  <div 
                    className="text-xs font-body"
                    style={{ color: COLORS.BLACK }}
                  >
                    {userProfile.language === 'en' ? 'Treasures' : 'Tesoros'}
                  </div>
                </div>
                <div>
                  <div 
                    className="text-2xl font-bold font-title"
                    style={{ color: COLORS.PRIMARY_BROWN }}
                  >
                    12
                  </div>
                  <div 
                    className="text-xs font-body"
                    style={{ color: COLORS.BLACK }}
                  >
                    {userProfile.language === 'en' ? 'Stories' : 'Historias'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensaje de bienvenida para primera vez */}
        {userProfile.isFirstTime && (
          <Card>
            <CardContent>
              <div 
                className="p-4 rounded-lg text-center"
                style={{ backgroundColor: COLORS.BACKGROUND }}
              >
                <p 
                  className="text-sm font-body"
                  style={{ color: COLORS.PRIMARY_BROWN }}
                >
                  {userProfile.language === 'en'
                    ? '✨ Welcome to your first magical adventure in Madrid!'
                    : '✨ ¡Bienvenido a tu primera aventura mágica en Madrid!'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomePage;
