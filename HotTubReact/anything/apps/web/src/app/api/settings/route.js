import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const [settings] = await sql`SELECT * FROM app_settings WHERE id = 1`;
    return Response.json(
      settings || {
        capacity: 1000,
        capacity_unit: "liters",
        measurement_system: "metric",
      },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { capacity, capacity_unit, measurement_system } = body;

    const [updated] = await sql`
      INSERT INTO app_settings (id, capacity, capacity_unit, measurement_system, updated_at)
      VALUES (1, ${capacity}, ${capacity_unit}, ${measurement_system}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        capacity = EXCLUDED.capacity,
        capacity_unit = EXCLUDED.capacity_unit,
        measurement_system = EXCLUDED.measurement_system,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
