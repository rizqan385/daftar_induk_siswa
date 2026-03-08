interface CardProps {
    title: string;
    value: number;
}

export const Card = ({ title, value }: CardProps) => {
    return (
        <div 
        style={{
            padding: "20px",
            background:"#1e293b",
            color: "white",
            borderRadius: "12px",
            minWidth: "180px",
        }}
        >
            <h4 style={{marginBottom: "10px"}}>{title}</h4>
            <h2>{value}</h2>
        </div>
    )
}

export default Card;