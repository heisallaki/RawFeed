"""ingestion fixes: nullable country, ai_enriched, verify_ssl

Revision ID: 0bd8b55d1665
Revises: 0976ecbaebf5
Create Date: 2026-09-06 21:37:25.055834
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '0bd8b55d1665'
down_revision: Union[str, None] = '0976ecbaebf5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('events', sa.Column('ai_enriched', sa.Boolean(), nullable=False, server_default=sa.text('false')))
    op.alter_column('events', 'country',
               existing_type=sa.VARCHAR(length=64),
               nullable=True)
    op.add_column('news_sources', sa.Column('verify_ssl', sa.Boolean(), nullable=False, server_default=sa.text('true')))

def downgrade() -> None:
    op.drop_column('news_sources', 'verify_ssl')
    op.alter_column('events', 'country',
               existing_type=sa.VARCHAR(length=64),
               nullable=False)
    op.drop_column('events', 'ai_enriched')